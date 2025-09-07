/*Program to generate fibonacci series 1, 1, 2, 3, 5, 8, 13, 34, 55, 89.............
In this series each number is a sum of  the previous two numbers*/
#include<stdio.h>
int main(void)
{
    long x, y, z;
    int i, n;
    x = 0;
    y = 1;
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    printf("%1d", y);
    for(i=1;i<n;i++)
    {
        z = x+y;
        printf("%1d", z);
        x = y;
        y = z;

    }
    printf("\n");
    return 0;
}