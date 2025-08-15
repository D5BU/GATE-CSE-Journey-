#include<stdio.h>
int main(void)
{
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    if (num<0)
    {
        printf("The number is negative!\n");
        num = -num;
    }
printf("Value of num is : %d\n", num);
return 0;

}