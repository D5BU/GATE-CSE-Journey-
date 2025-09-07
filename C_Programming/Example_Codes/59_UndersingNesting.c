//Program to understand nesting in for loop
#include<stdio.h>
int main(void)
{
    int i, j;
    for(i=1; i<=3; i++)
    {
        printf("i=%d\n", i);
        for(j=1; j<=4; j++)
        printf("j=%d\t", j);
        printf("\n");

    }
    return 0;
}